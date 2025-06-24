// components/Loader.jsx
import React from "react";
import { MutatingDots } from "react-loader-spinner";

const Loader = ({ color }) => {
  return (
    <MutatingDots
      height="100"
      width="100"
      color={color}
      secondaryColor={color}
      radius="12.5"
      ariaLabel="mutating-dots-loading"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
    />
  );
};

export default Loader;