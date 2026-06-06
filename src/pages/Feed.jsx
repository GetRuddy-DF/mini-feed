import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState(null);
  const [activeComments, setActiveComments] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
    fetchPosts();
  }, []);

  // FETCH POSTS
  const fetchPosts = async () => {
    const { data } = await supabase
      .from("posts")
      .select(`
        *,
        profiles(username),
        likes(id, user_id),
        comments(id, text, created_at, profiles(username))
      `)
      .order("created_at", { ascending: false });

    setPosts(data || []);
  };

  // ADD POST
  const addPost = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    await supabase.from("posts").insert({
      text: trimmed,
      user_id: user.id,
    });

    setText("");
    fetchPosts();
  };

  // DELETE POST
  const deletePost = async (id) => {
    await supabase.from("posts").delete().eq("id", id);
    fetchPosts();
  };

  // LIKE POST
  const likePost = async (post) => {
    const already = post.likes?.find(l => l.user_id === user.id);

    if (already) {
      await supabase.from("likes").delete().eq("id", already.id);
    } else {
      await supabase.from("likes").insert({
        post_id: post.id,
        user_id: user.id,
      });
    }
    fetchPosts();
  };

  // ADD COMMENT
  const addComment = async (postId) => {
    const raw = (commentInputs[postId] || "").trim();
    if (!raw) return;

    await supabase.from("comments").insert({
      post_id: postId,
      user_id: user.id,
      text: raw,
    });

    setCommentInputs(prev => ({ ...prev, [postId]: "" }));
    fetchPosts();
  };

  // DELETE COMMENT
  const deleteComment = async (commentId) => {
    await supabase.from("comments").delete().eq("id", commentId);
    fetchPosts();
  };

  // LOGOUT
  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleKey = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") addPost();
  };

  const handleCommentKey = (e, postId) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") addComment(postId);
  };

  return (
    <div className="container">
      <div className="card">
        <div className="feed-header">
          <h1 className="title">Mini-Feed</h1>
          <button className="btn ghost" onClick={logout}>Logout</button>
        </div>

        <textarea
          className="input"
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
        />
        <div className="row">
          <button className="btn primery" onClick={addPost}>Post</button>
          <button className="btn ghost" onClick={() => setText("")}>Clear</button>
        </div>
      </div>

      <div className="feed">
        {posts.length === 0 && <p className="empty">No posts yet...</p>}
        {posts.map(p => (
          <article key={p.id} className="post">
            <div className="avatar">
              {p.profiles?.username?.[0]?.toUpperCase() || "U"}
            </div>

            <div className="post-main">
              <div className="post-author">@{p.profiles?.username}</div>
              <p className="post-text">{p.text}</p>

              <div className="post-meta">
                <small className="date">
                  {new Date(p.created_at).toLocaleString()}
                </small>
                <div className="actions">
                  <button
                    className={`like ${p.likes?.find(l => l.user_id === user?.id) ? "liked" : ""}`}
                    onClick={() => likePost(p)}
                  >
                    👍 {p.likes?.length || 0}
                  </button>
                  <button
                    className="comment-btn"
                    onClick={() => setActiveComments(prev => prev === p.id ? null : p.id)}
                  >
                    💬 {p.comments?.length || 0}
                  </button>
                  {p.user_id === user?.id && (
                    <button className="del" onClick={() => deletePost(p.id)}>Delete</button>
                  )}
                </div>
              </div>

              {activeComments === p.id && (
                <div className="comments-panel">
                  {p.comments?.length === 0 && (
                    <p className="empty-comment">No comments yet</p>
                  )}
                  {p.comments?.map(c => (
                    <div className="comment" key={c.id}>
                      <div className="c-avatar">
                        {c.profiles?.username?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div className="c-main">
                        <div className="c-author">@{c.profiles?.username}</div>
                        <div className="c-text">{c.text}</div>
                      </div>
                      <div className="c-meta">
                        <small>{new Date(c.created_at).toLocaleString()}</small>
                        {c.user_id === user?.id && (
                          <button className="c-del" onClick={() => deleteComment(c.id)}>×</button>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="add-comment">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentInputs[p.id] || ""}
                      onChange={(e) => setCommentInputs(prev => ({ ...prev, [p.id]: e.target.value }))}
                      onKeyDown={(e) => handleCommentKey(e, p.id)}
                    />
                    <button className="send-btn" onClick={() => addComment(p.id)}>➤</button>
                  </div>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}