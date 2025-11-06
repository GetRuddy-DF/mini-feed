import { useState, useEffect } from "react";

export default function App() {

  const [posts, setPosts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("posts")) || [];
    } catch {
      return [];
    }
  });

  const [text, setText] = useState("");
  const [activeCommentsPostId, setActiveCommentsPostId] = useState(null);
  const [likedPosts, setLikedPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});

  // SAVED POSTS IN LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

  // ADD POSTS 
  const addPost = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const newPost = {
      id: Date.now(),
      text: trimmed,
      date: new Date().toLocaleString(),
      likes: 0,
      comments: [],
    };
    setPosts(prev => [newPost, ...prev]);
    setText("");
  };
  // LIKED POSTS 
  const likePost = (id, e) => {
    const button = e?.target;
    const alreadyLiked = likedPosts.includes(id);

    if (alreadyLiked) {
      setPosts(prev => prev.map(p => p.id === id ? {...p, likes: Math.max(0, p.likes -1) } : p)
    );
    setLikedPosts(prev => prev.filter(pid => pid !== id));
    } else {
      setPosts(prev => 
        prev.map(p => p.id === id ? {...p, likes: p.likes + 1} : p)
      );
      setLikedPosts(prev => [...prev, id]);
    }
    if (button) spawnHearts(button);
  };

  const spawnHearts = (button) => {
    const heart = document.createElement("span");
    heart.className = "heart-pop";
    heart.textContent = "👍";
    const rect = button.getBoundingClientRect();
    heart.style.left = rect.left + rect.width / 2 + "px";
    heart.style.top = rect.top + "px";
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 1000);
  };

  // DELETING POSTS 
  const deletePost = (id) => {
    const el = document.querySelector(`[data-id="${id}"]`);
    if (el) {
      el.classList.add("removing");
      setTimeout(() => {
        setPosts(prev => prev.filter(p => p.id !== id));
      }, 300);
    } else {
      setPosts(prev => prev.filter(p => p.id !== id));
    }
  };

  // DELETING COMMENTS FOR ID 
  const deleteComment = (postId, commentId) => {
      setPosts((prev) =>
      prev.map((p) => 
        p.id === postId ? {...p, comments: p.comments.filter((c) => c.id !== commentId) } : p
      )
    );
  };

  // COMMENTS POST
  const toggleComments = (id) => {
    setActiveCommentsPostId((prev) => (prev === id ? null : id));
  };

  const setCommentInputFor = (postId, value) => {
    setCommentInputs((prev) => ({...prev, [postId]: value}));
  };

  //COMMNETS ADD 

  const addComment = (postId) => {
    const raw = (commentInputs[postId] || "").trim();
    if (!raw) return;

    const newComment = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      text: raw,
      date: new Date().toLocaleString(),
    };

    setPosts((prev) => 
      prev.map((p) => (p.id === postId ? {...p, comments: [...p.comments, newComment] } : p))
    );
    setCommentInputs((prev) => ({...prev, [postId]: ""}));
  };

  // PRESS ENTER FOR POST 
  const handleKey = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      addPost();
    }
  };

  const handleCommentKey = (e, postId) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      addComment(postId);
    }
  };


  return (
    <div className="app">
      <div className="card container">
        <h1 className="title"> Mini-Feed</h1>

        <textarea 
        className="input"
        placeholder="What's Up what new ?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKey}
        />

        <div className="row">
          <button className="btn primery" onClick={addPost}>Post</button>
          <button className="btn ghost" onClick={() => setText("")}>Clear</button>
        </div>

        <div className="feed">
          {posts.length === 0 && <p className="empty">This clear...</p>}
          {posts.map((p) => (
            <article key={p.id} data-id={p.id} className="post">
              <div className="post-left">
                <div className="avatar">{String(p.text).trim()[0]?.toUpperCase() || "U"}</div>
              </div>

              <div className="post-main">
                <p className="post-text">{p.text}</p>
                <div className="post-meta">
                  <small className="date">{p.date}</small>

                  <div className="actions">
                    <button 
                      className={`like ${likedPosts.includes(p.id) ? "liked" : ""}`} 
                      onClick={(e) => likePost(p.id, e)}
                    >
                      👍 {p.likes}
                    </button>

                    <button 
                    className="comment-btn" 
                    onClick={() => toggleComments(p.id)}>
                      💭 {p.comments.length}
                    </button>
                    
                    <button className="del" onClick={() => deletePost(p.id)}>Delete</button>
                  </div>
                </div>

                {/* COMMENTS PANEL: show when activeToggleCommentsPostId  */}

                {activeCommentsPostId === p.id && (
                  <div className="comments-panel">
                    <div className="existing-comments">
                      {p.comments.length === 0 ? (
                        <p className="empty-comment">No comments, but maybe you first</p>
                      ) : (
                        p.comments.map((c) => (
                          <div className="comment" key={c.id}>
                            <div className="c-left">
                              <div className="c-avatar">{String(c.text).trim()[0]?.toUpperCase() || "U"}</div>
                            </div>
                            <div className="c-main">
                              <div className="c-text">{c.text}</div>
                            </div>
                            <div className="c-meta">
                              <small className="c-date">{c.date}</small>
                              <button className="c-del" onClick={() => deleteComment(p.id, c.id)}>Delete</button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="add-comment">
                      <input 
                      type="text"
                      placeholder="write comment..."
                      value={commentInputs[p.id] || ""}
                      onChange={(e) => setCommentInputFor(p.id, e.target.value)}
                      onKeyDown={(e) => handleCommentKey(e, p.id)}
                      />
                      <button className="send-btn" onСlick={() => addComment(p.id)}>💭</button>
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}