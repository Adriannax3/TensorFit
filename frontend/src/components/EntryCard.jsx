import { useEffect, useState } from "react";
import { Card, Avatar, Space, Input, Button, List } from "antd";
import { LikeOutlined, LikeFilled, MessageOutlined } from "@ant-design/icons";
import axios from "../axios";
import { theme } from "antd";

function decodeImage(image) {
  if (!image) return null;

  if (typeof image === "string") {
    if (image.startsWith("data:")) {
      return image;
    }
    return `data:image/png;base64,${image}`;
  }

  if (image?.data && Array.isArray(image.data)) {
    const uint8 = new Uint8Array(image.data);
    const binary = uint8.reduce((s, b) => s + String.fromCharCode(b), "");
    const base64 = btoa(binary);
    return `data:image/png;base64,${base64}`;
  }

  return null;
}

export default function EntryCard({ entry }) {
  const imageSrc = decodeImage(entry.image);
  const { token } = theme.useToken();
  const primaryColor = token.colorPrimary;

  const username = entry.User?.username || entry.username || "Anonim";
  const createdAt = entry.createdAt
    ? new Date(entry.createdAt).toLocaleString("pl-PL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const [liked, setLiked] = useState(!!entry.likedByMe);
  const [likeCount, setLikeCount] = useState(entry.likeCount ?? 0);

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentCount, setCommentCount] = useState(entry.commentCount ?? 0);
  const [addingComment, setAddingComment] = useState(false);

  useEffect(() => {
    setLiked(!!entry.likedByMe);
    setLikeCount(entry.likeCount ?? 0);
    setCommentCount(entry.commentCount ?? 0);
  }, [entry]);

  const handleToggleLike = async () => {
    try {
      const res = await axios.post(`/entries/${entry.id}/like`);
      setLiked(res.data.liked);
      setLikeCount(res.data.likeCount);
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const fetchEntryDetails = async () => {
    const res = await axios.get(`/entries/${entry.id}`);
    const e = res.data;
    const list = e.Comments || [];
    setComments(list);

    if (typeof e.commentCount === "number") {
      setCommentCount(e.commentCount);
    } else {
      setCommentCount(list.length);
    }
  };

  const handleToggleComments = async () => {
    const willOpen = !commentsOpen;
    setCommentsOpen(willOpen);
    if (willOpen) {
      try {
        setCommentsLoading(true);
        await fetchEntryDetails();
      } catch (err) {
        console.error("Error loading comments:", err);
      } finally {
        setCommentsLoading(false);
      }
    }
  };

  const handleAddComment = async () => {
    const content = newComment.trim();
    if (!content) return;

    try {
      setAddingComment(true);
      await axios.post(`/entries/${entry.id}/comments`, { content });

      await fetchEntryDetails();
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    } finally {
      setAddingComment(false);
    }
  };

  return (
    <Card style={{ marginBottom: 16 }} styles={{ body: { padding: 16 } }}>
      <Space align="start">
        <Avatar>{username[0]}</Avatar>
        <div>
          <strong>{username}</strong>
          {createdAt && (
            <div style={{ fontSize: 12, opacity: 0.7 }}>{createdAt}</div>
          )}
        </div>
      </Space>

      {entry.title && (
        <h3 style={{ marginTop: 12, marginBottom: 8 }}>{entry.title}</h3>
      )}

      {entry.description && (
        <p style={{ marginBottom: 8, whiteSpace: "pre-line" }}>
          {entry.description}
        </p>
      )}

      {imageSrc && (
        <img
          src={imageSrc}
          alt="entry"
          style={{
            width: "100%",
            maxHeight: 300,
            objectFit: "contain",
            borderRadius: 8,
            marginTop: 8,
          }}
        />
      )}

      <Space size="large" style={{ marginTop: 12 }}>
        <span
          onClick={handleToggleLike}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
            color: liked ? primaryColor : token.colorText,
          }}
        >
          {liked ? (
            <LikeFilled style={{ fontSize: 18, color: primaryColor }} />
          ) : (
            <LikeOutlined style={{ fontSize: 18 }} />
          )}
          {likeCount}
        </span>
      
        <span
          onClick={handleToggleComments}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
            color: commentCount > 0 ? primaryColor : token.colorText,
          }}
        >
          <MessageOutlined
            style={{
              fontSize: 18,
              color: commentCount > 0 ? primaryColor : token.colorText,
            }}
          />
          {commentCount}
        </span>
      </Space>

      {commentsOpen && (
        <div style={{ marginTop: 16 }}>
          <Input.TextArea
            rows={2}
            placeholder="Dodaj komentarz..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />

          <div style={{ textAlign: "right", marginTop: 8 }}>
            <Button
              type="primary"
              size="small"
              loading={addingComment}
              onClick={handleAddComment}
            >
              Dodaj komentarz
            </Button>
          </div>

          <List
            loading={commentsLoading}
            dataSource={comments}
            locale={{ emptyText: "Brak komentarzy" }}
            style={{ marginTop: 16 }}
            renderItem={(c) => (
              <List.Item>
                <Space align="start">
                  <Avatar>{c.User?.username?.[0] ?? "U"}</Avatar>
                  <div>
                    <div style={{ fontWeight: 600 }}>
                      {c.User?.username || "Użytkownik"}
                    </div>
                    <div>{c.content}</div>
                  </div>
                </Space>
              </List.Item>
            )}
          />
        </div>
      )}
    </Card>
  );
}
