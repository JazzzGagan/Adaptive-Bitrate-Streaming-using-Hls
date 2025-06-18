import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { FaCloudUploadAlt } from 'react-icons/fa'
import toast from 'react-hot-toast'
import socket from '../socket'

const Status = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  ERROR: 'error',
  SUCCESS: 'success',
  CONVERTING: 'converting',
}

const UploadMovies = () => {
  const [videoTitle, setVideoTitle] = useState('')
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState(Status.IDLE)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [convertProgress, setConvertProgress] = useState(0)
  const [titleError, setTitleError] = useState('')

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id)
    })

    const handleUploadComplete = (data) => {
      console.log(data.message)
      setStatus(Status.CONVERTING)
      setUploadProgress(100)
    }

    const handleConversionProgress = (data) => {
      if (data.progress !== undefined) {
        setConvertProgress(data.progress)
        console.log(data.progress)
      }
    }

    const handleConversionComplete = (data) => {
      toast.success(data.message || 'Conversion Completed Sucessfully')
      setStatus(Status.SUCCESS)
      setVideoTitle('')
      setFile(null)
    }

    socket.on('upload_complete', handleUploadComplete)
    socket.on('progress_update', handleConversionProgress)
    socket.on('conversion_completed', handleConversionComplete)

    return () => {
      socket.off('upload_complete', handleUploadComplete)
      socket.off('progress_update', handleConversionProgress)
      socket.off('conversion_completed', handleConversionComplete)
    }
  }, [])

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleFileUpload = async () => {
    if (!file) return
    if (!videoTitle.trim()) {
      setTitleError('Video title is required')
      return
    }

    setTitleError('')
    setStatus(Status.UPLOADING)
    setUploadProgress(0)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', videoTitle)

    try {
      await axios.post('http://127.0.0.1:5000/admin/convertvideo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0

          setUploadProgress(progress)
        },
      })
    } catch {
      toast.error('Upload failed.')
      setStatus(Status.ERROR)
      setUploadProgress(0)
    }
  }

  return (
    <div className="w-[50%] h-[80vh] font-Helvetica flex flex-col justify-center items-center ml-72 mt-8 pt-10 space-y-6 bg-slate-50 rounded-3xl border-2 border-cyan-600 ">
      <div className="w-[80%] h-20 flex flex-col items-center space-y-2">
        <h1 className="text-4xl font-medium font-Helvetica">
          Convert video to Hls format{' '}
        </h1>
        <p className="pl-4 font-Coolvetica text-xl ">
          Upload your video file here
        </p>
      </div>

      <div className="w-[90%] h-auto outline-[6px] outline-cyan-500 outline rounded-2xl">
        <form
          id="myForm"
          className="w-full h-auto border border-dotted border-white bg-cyan-600 rounded-2xl"
        >
          <label
            htmlFor="fileInput"
            className="flex flex-col items-center justify-center h-64 cursor-pointer"
          >
            <div className="w-full h-auto flex flex-col items-center gap-3">
              <p className="text-lg font-semibold text-white">
                Select Video to Upload
              </p>
              <div className="mt-4 w-44 space-y-4">
                <div className="bg-slate-100 hover:bg-slate-200 flex justify-evenly items-center text-black px-4 py-2 rounded-lg shadow">
                  Select File
                  <FaCloudUploadAlt className="text-3xl" />
                </div>
                {file && (
                  <div className="flex flex-col line-clamp-2 text-white">
                    <p>FileName: {file.name}</p>
                    <p>Size: {(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    <p>Type: {file.type}</p>
                  </div>
                )}

                <input
                  type="file"
                  id="fileInput"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="video/*"
                />
              </div>
            </div>
          </label>
        </form>
      </div>

      {/* Upload Progress Bar */}
      {status === Status.UPLOADING && (
        <div className="space-y-2 w-[90%]">
          <div className="h-2.5 w-full rounded-full bg-gray-200">
            <div
              className="h-2.5 rounded-full bg-cyan-600 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
            <p className="text-sm font-Coolvetica text-gray-600 ">
              {uploadProgress}% uploaded{' '}
            </p>
          </div>
        </div>
      )}

      {/* Conversion Progress Bar */}
      {status === Status.CONVERTING && (
        <div className="w-[90%] space-y-1">
          <p className="text-lg font-semibold">Converting...</p>
          <progress value={convertProgress} max="100" className="w-full h-4" />
          <p className="text-sm font-Coolvetica text-gray-600">
            {convertProgress}%
          </p>
        </div>
      )}

      <div className="w-64 h-24 flex flex-col items-start justify-center space-y-2">
        <label
          htmlFor="videoTitle"
          className="block text-sm font-medium text-black"
        >
          Video Title:
        </label>
        {titleError && (
          <p className="text-red-500 text-xs font-medium">{titleError}</p>
        )}
        <input
          type="text"
          value={videoTitle}
          placeholder="Enter your video title.."
          className="w-full p-2 rounded bg-white bg-opacity-10 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00acc1] border border-gray-900 border-opacity-20"
          onChange={(e) => setVideoTitle(e.target.value)}
          form="myForm"
          required
          disabled={status === Status.UPLOADING || status === Status.CONVERTING}
        />
      </div>

      {file && status !== Status.UPLOADING && status !== Status.CONVERTING && (
        <button
          onClick={handleFileUpload}
          className="w-[50%] h-10 mb-6 text-white bg-cyan-600 hover:bg-cyan-700 rounded-lg"
        >
          Upload
        </button>
      )}

      {status === Status.ERROR && (
        <p className="text-red-500 text-sm">Upload failed. Please try again</p>
      )}
    </div>
  )
}

export default UploadMovies
