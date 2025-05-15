"use client"
import Lottie from "lottie-react";

export const LottieAnimation = ({
  animationData,
  ...rest
}:{
  animationData: any,
  [key: string]: any
}) => {
  return (
    <Lottie animationData={animationData} {...rest}/>
  )
}
