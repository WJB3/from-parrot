import { CSSProperties } from "react";
export const container: CSSProperties = {
  width: 500,
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  boxShadow: "0px 2px 4px rgba(20, 52, 31, 0.06)",
  padding: "60px 70px 50px 70px",
  borderRadius: 10,
  background: "#fff",
};
export const layout: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background:
    "url(https://api.xshs.cn:8688/frontend/login_bg.jpg) top center no-repeat",
  backgroundSize: "cover",
};
export const title: CSSProperties = {
  fontSize: 20,
  fontWeight: 500,
  textAlign: "center",
  color: "#303133",
  marginLeft: 7,
};

export const logo: CSSProperties = {
  textAlign: "center",
};

export const unChoose: CSSProperties = {
  textAlign: "center",
  color: "#84878C",
  fontSize: 16,
  fontFamily: "PingFang SC",
};

export const choose: CSSProperties = {
  textAlign: "center",
  color: "#303133",
  fontSize: 18,
  fontFamily: "PingFang SC",
  fontWeight:"bold"
};
