import React from "react";

const ItemsList = ({ items }) => {
    console.log(items);
    
  return (
    <>
      {items.length === 0 ? (
        <p>No Users Found</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>{item.firstName}</li>
          ))}
        </ul>
      )}
    </>
  );
};

export default ItemsList;
