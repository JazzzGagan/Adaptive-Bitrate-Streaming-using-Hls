import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-10 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        {/* Branding */}
        <div>
          <div className="text-2xl font-bold text-[#00acc1] mb-4">
            🎬 Cinephine
          </div>
          <p className="text-white/80">
            Your entertainment hub for the latest movies & shows.
          </p>
        </div>

        {/* Cinephine */}
        <div>
          <h4 className="text-white font-semibold mb-2">Cinephine</h4>
          <ul className="space-y-1 text-white/70">
            <li>TV Guide</li>
            <li>Screenshots</li>
            <li>Update Logs</li>
          </ul>
        </div>

        {/* Account */}
        <div>
          <h4 className="text-white font-semibold mb-2">Account</h4>
          <ul className="space-y-1 text-white/70">
            <li>VIP</li>
            <li>Family Plan</li>
            <li>Devices Manager</li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="text-white font-semibold mb-2">Help</h4>
          <ul className="space-y-1 text-white/70">
            <li>FAQ</li>
            <li>Tickets</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="mt-10 border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-white/60 gap-4">
        <p>&copy; {new Date().getFullYear()} Cinephile. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <img src="/icons/apple.svg" alt="Apple" className="w-5 h-5" />
          <img src="/icons/android.svg" alt="Android" className="w-5 h-5" />
          <img src="/icons/tv.svg" alt="TV" className="w-5 h-5" />
          <img src="/icons/windows.svg" alt="Windows" className="w-5 h-5" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
