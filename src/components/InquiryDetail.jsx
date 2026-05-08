import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./scss/InquiryDetail.scss";

export default function InquiryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

  const inquiries = JSON.parse(localStorage.getItem("inquiries")) || [];

  const inquiry = inquiries.find((item) => String(item.id) === String(id));
  const isReplyDone = inquiry?.reply === "답변완료";
  const replyEmail = inquiry?.email?.trim();

  if (!inquiry) {
    return (
      <section className="sub-section inquiry-detail-page">
        <div className="inner">
          <div className="inquiry-detail-top">
            <h2>1:1 문의</h2>

            <button
              type="button"
              className="detail-back-btn"
              onClick={() =>
                navigate("/userInfo", {
                  state: { menu: "1:1 문의" },
                })
              }
            >
              목록으로
            </button>
          </div>

          <div className="detail-wrap">
            <p className="empty-text">문의 내역이 없습니다.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="sub-section inquiry-detail-page">
      <div className="inner">
        <div className="inquiry-detail-top">
          <h2>1:1 문의</h2>

          <button
            type="button"
            className="detail-back-btn"
            onClick={() =>
              navigate("/userInfo", {
                state: { menu: "1:1 문의" },
              })
            }
          >
            목록으로
          </button>
        </div>

        <div className="detail-wrap">
          <div className="detail-top">
            <div className="detail-head">
              <h2>{inquiry.subject}</h2>
            </div>

            <div className="detail-info">
              <span>{inquiry.date}</span>

              <span>{inquiry.category}</span>

              <span>{inquiry.writer}</span>

              <span
                className={`reply-state ${
                  inquiry.reply === "답변완료" ? "done" : "wait"
                }`}
              >
                {inquiry.reply}
              </span>
            </div>
            <div className="detail-content-wrap">
              <div className="detail-content">{inquiry.content}</div>

            </div>
          </div>

          {inquiry.files?.length > 0 && (
            <div className="detail-files">
              <p className="detail-title">첨부파일</p>

              <ul>
                {inquiry.files.map((file, index) => (
                  <li key={`${file.name}-${index}`}>
                    {file.type?.startsWith("image/") ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        onClick={() => setSelectedImage(file.url)}
                      />
                    ) : (
                      <a href={file.url} target="_blank" rel="noreferrer">
                        {file.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isReplyDone && (
            <div className="inquiry-detail-notice">
              <ul>
                <li>
                  답변이 완료되어 {replyEmail || "등록된 이메일"}로 안내드렸습니다.
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="확대 이미지" />
        </div>
      )}
    </section>
  );
}
