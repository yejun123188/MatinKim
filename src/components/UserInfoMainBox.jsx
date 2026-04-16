import React from "react";

export default function UserInfoMainBox({ title, children, className = "" }) {
  return (
    <div className={`main-box ${className}`}>
      <h3 className="main-box-title">{title}</h3>
      <div className="main-box-content">{children}</div>
    </div>
  );
}
