import { Carousel, Col, Modal, Row, Image } from "antd";
import { RotateLeftOutlined, RotateRightOutlined } from "@ant-design/icons";
import GT from "types";
import React, { useState, useRef } from "react";
import IconFont from "src/components/IconFont";

export default function PicturesShow(props: GT.Modal.Props) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [position, setPosition] = useState(0);
  const [pictures, setPictures] = useState<string[]>([]);
  const carousel = useRef<Carousel>(null);

  const [degress, setDegree] = useState(0);

  props.onRef({
    setVisible,
    setTitle,
    setPosition,
    setPictures,
  });

  const handleOk = () => {
    setVisible(false);
    setDegree(0);
  };

  const handleCancel = () => {
    setVisible(false);
    setDegree(0);
  };

  if (carousel) {
    carousel.current?.goTo(position);
  }

  return (
    <Modal
      centered
      visible={visible}
      onCancel={handleCancel}
      onOk={handleOk}
      width={"90%"}
      okButtonProps={{ hidden: true }}
      cancelButtonProps={{ hidden: true }}
    >
      <div>
        <Row>
          <Col span={2} offset={22}>
            <RotateLeftOutlined
              style={{ fontSize: 20 }}
              onClick={() => {
                setDegree(degress - 90);
              }}
            />
            <RotateRightOutlined
              style={{ fontSize: 20, marginLeft: 20 }}
              onClick={() => {
                setDegree(degress + 90);
              }}
            />
          </Col>
        </Row>
        <Row align="middle">
          <Col span={2} offset={1}>
            <IconFont
              hidden={position === 0}
              type="iconlujing333"
              style={{
                fontSize: 40,
                visibility:
                  pictures && pictures.length > 1 ? "visible" : "hidden",
              }}
              onClick={() => {
                carousel.current?.prev();
                setDegree(0);
              }}
            ></IconFont>
          </Col>
          <Col span={18}>
            <Carousel
              dots={false}
              ref={carousel}
              initialSlide={position}
              style={{ textAlign: "center" }}
              afterChange={(current) => {
                setPosition(current);
              }}
            >
              {pictures?.map((item, index) => {
                return (
                  <div style={{ height: "80vh" }}>
                    <div
                      style={{
                        transform:
                          position === index ? `rotate(${degress}deg)` : "",
                        width: "100%",
                        height: "80vh",
                        background: `url(${item}) center center / contain no-repeat`,
                      }}
                    ></div>
                  </div>
                );
              })}
            </Carousel>
          </Col>
          <Col span={1} offset={2}>
            <IconFont
              hidden={position === pictures.length - 1}
              type="iconlujing333-fuben"
              style={{
                fontSize: 40,
                visibility:
                  pictures && pictures.length > 1 ? "visible" : "hidden",
              }}
              onClick={() => {
                carousel.current?.next();
                setDegree(0);
              }}
            ></IconFont>
          </Col>
        </Row>
      </div>
    </Modal>
  );
}
