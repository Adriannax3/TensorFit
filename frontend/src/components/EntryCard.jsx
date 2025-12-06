import { useEffect, useState } from "react";
import {
  Card,
  Avatar,
  Space,
  Input,
  Button,
  List,
  theme,
  Popconfirm,
  message,
} from "antd";
import {
  LikeOutlined,
  LikeFilled,
  MessageOutlined,
} from "@ant-design/icons";
import axios from "../axios";
import { useAuth } from "../context/useAuth";

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

export default function EntryCard({ entry, onDeleted, onUpdated }) {
  const imageSrc = decodeImage(entry.image);
  const { token } = theme.useToken();
  const primaryColor = token.colorPrimary;

  const { user } = useAuth() || {};
  const currentUserId = user?.id ?? null;

  const username = entry.User?.username || entry.username || "Anonim";
  const avatarColor = entry.User?.avatarColor || "#ccc";

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

  const [deletingCommentId, setDeletingCommentId] = useState(null);

  const canEditPost = !!entry.isMine;
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(entry.title || "");
  const [editDescription, setEditDescription] = useState(
    entry.description || ""
  );
  const [savingEdit, setSavingEdit] = useState(false);

  const [deletingEntry, setDeletingEntry] = useState(false);

  useEffect(() => {
    setLiked(!!entry.likedByMe);
    setLikeCount(entry.likeCount ?? 0);
    setCommentCount(entry.commentCount ?? 0);
    setEditTitle(entry.title || "");
    setEditDescription(entry.description || "");
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

  const handleStartEdit = () => {
    if (!canEditPost) return;
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle(entry.title || "");
    setEditDescription(entry.description || "");
  };

  const handleSaveEdit = async () => {
    const title = editTitle.trim();
    const description = editDescription.trim();

    if (!title) return;

    try {
      setSavingEdit(true);
      const res = await axios.put(`/entries/${entry.id}`, {
        title,
        description,
      });

      const updated = res.data || {};
      setEditTitle(updated.title ?? title);
      setEditDescription(updated.description ?? description);
      
      if (onUpdated) {
        onUpdated(updated);
      }
      
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating entry:", err);
    } finally {
      setSavingEdit(false);
    }
  };

  const canDeleteComment = (comment) => {
    if (entry.isMine) return true;
    if (!currentUserId) return false;
    return comment.userId === currentUserId;
  };

  const handleDeleteComment = async (commentId) => {
    if (!commentId) return;
    try {
      setDeletingCommentId(commentId);
      await axios.delete(`/entries/${entry.id}/comments/${commentId}`);

      setComments((prev) =>
        prev.filter((c) => (c.id ?? c.commentId) !== commentId)
      );
      setCommentCount((prev) => (prev > 0 ? prev - 1 : 0));

      message.success("Komentarz został usunięty");
    } catch (err) {
      console.error("Error deleting comment:", err);
      message.error("Nie udało się usunąć komentarza");
    } finally {
      setDeletingCommentId(null);
    }
  };

  const handleDeleteEntry = async () => {
    try {
      setDeletingEntry(true);
      await axios.delete(`/entries/${entry.id}`);
      message.success("Wpis został usunięty");
      if (onDeleted) {
        onDeleted(entry.id);
      }
    } catch (err) {
      console.error("Error deleting entry:", err);
      message.error("Nie udało się usunąć wpisu");
    } finally {
      setDeletingEntry(false);
    }
  };

  return (
    <Card style={{ marginBottom: 16 }} styles={{ body: { padding: 16 } }}>
      <Space
        align="start"
        style={{ width: "100%", justifyContent: "space-between" }}
      >
        <Space align="start">
          <Avatar style={{ backgroundColor: avatarColor }}>
            {username[0]}
          </Avatar>
          <div>
            <strong>{username}</strong>
            {createdAt && (
              <div style={{ fontSize: 12, opacity: 0.7 }}>{createdAt}</div>
            )}
          </div>
        </Space>

        {canEditPost && (
          <Space>
            {isEditing ? (
              <>
                <Button size="small" onClick={handleCancelEdit}>
                  Anuluj
                </Button>
                <Button
                  type="primary"
                  size="small"
                  loading={savingEdit}
                  onClick={handleSaveEdit}
                >
                  Zapisz
                </Button>
              </>
            ) : (
              <>
                <Button size="small" onClick={handleStartEdit}>
                  Edytuj wpis
                </Button>
                <Popconfirm
                  title="Usunąć wpis?"
                  description="Tej operacji nie można cofnąć."
                  okText="Usuń"
                  cancelText="Anuluj"
                  okButtonProps={{ danger: true, loading: deletingEntry }}
                  onConfirm={handleDeleteEntry}
                >
                  <Button size="small" danger loading={deletingEntry}>
                    Usuń wpis
                  </Button>
                </Popconfirm>
              </>
            )}
          </Space>
        )}
      </Space>

      {canEditPost && isEditing ? (
        <>
          <Input
            placeholder="Tytuł"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            style={{ marginTop: 12, marginBottom: 8 }}
          />
          <Input.TextArea
            placeholder="Opis"
            autoSize={{ minRows: 2 }}
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            style={{ marginBottom: 8 }}
          />
        </>
      ) : (
        <>
          {entry.title && (
            <h3 style={{ marginTop: 12, marginBottom: 8 }}>{entry.title}</h3>
          )}

          {entry.description && (
            <p style={{ marginBottom: 8, whiteSpace: "pre-line" }}>
              {entry.description}
            </p>
          )}
        </>
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
            renderItem={(c) => {
              const commentUsername = c.User?.username || "Użytkownik";
              const commentColor = c.User?.avatarColor || "#ccc";
              const canDelete = canDeleteComment(c);
              const commentId = c.id ?? c.commentId;

              return (
                <List.Item
                  actions={
                    canDelete
                      ? [
                          <Popconfirm
                            title="Usunąć komentarz?"
                            okText="Usuń"
                            cancelText="Anuluj"
                            okButtonProps={{
                              danger: true,
                              loading: deletingCommentId === commentId,
                            }}
                            onConfirm={() => handleDeleteComment(commentId)}
                          >
                            <Button
                              type="link"
                              danger
                              size="small"
                              loading={deletingCommentId === commentId}
                            >
                              Usuń
                            </Button>
                          </Popconfirm>,
                        ]
                      : []
                  }
                >
                  <Space align="start">
                    <Avatar style={{ backgroundColor: commentColor }}>
                      {commentUsername[0]}
                    </Avatar>
                    <div>
                      <div style={{ fontWeight: 600 }}>{commentUsername}</div>
                      <div>{c.content}</div>
                    </div>
                  </Space>
                </List.Item>
              );
            }}
          />
        </div>
      )}
    </Card>
  );
}
