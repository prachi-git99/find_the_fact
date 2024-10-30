import { useEffect, useState } from "react";
import "./style.css";
import supabase from "./supabase";

const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFact] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");

  //to initially get facts
  useEffect(
    function () {
      async function getFacts() {
        setIsLoading(true);

        let query = supabase.from("fact").select("*");

        if (currentCategory !== "all") {
          query = query.eq("category", currentCategory);
        }

        const { data: fact, error } = await query
          .order("votesInteresting", { ascending: false })
          .limit(1000);

        if (!error) setFact(fact);
        else alert("There was a problem getting data");
        setIsLoading(false);
      }
      getFacts();
    },
    [currentCategory]
  );

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />
      {showForm ? (
        <NewFactForm setFact={setFact} setShowForm={setShowForm} />
      ) : null}

      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        {isLoading ? <Loader /> : <FactList facts={facts} setFact={setFact} />}
      </main>
    </>
  );
}

function Loader() {
  return <p className="message">Loading....</p>;
}

function Header({ showForm, setShowForm }) {
  const appTitle = "Fun Facts";

  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" height="100" width="100" alt="Fun Facts Logo" />
        <h1>{appTitle}</h1>
      </div>

      <button
        className="btn btn-large header-btn btn-open"
        onClick={() => setShowForm((show) => !showForm)}
      >
        {showForm ? "Close X" : "Share a fact"}
      </button>
    </header>
  );
}

function NewFactForm({ setFact, setShowForm }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const textLength = text.length;

  async function handleSubmit(e) {
    // 1. prevent browser default
    e.preventDefault();
    // 2. check if data is valid. If so create a new fact

    if (text && isValidHttpUrl(source) && category && textLength <= 200) {
      // 3.upload fact to superbase
      setIsUploading(true);
      const { data: newFact, error } = await supabase
        .from("fact")
        .insert([{ text, source, category }])
        .select();
      setIsUploading(false);

      // 4. add new fact to ui: add fact to state
      if (!error) setFact((facts) => [newFact[0], ...facts]);
      // 5. reset inout fields
      setText("");
      setCategory("");
      setSource("");
      // 6. close the form
      setShowForm(false);
    }
  }

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a fact with world..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <span>{200 - textLength}</span>
      <input
        value={source}
        type="text"
        placeholder="Trustworthy source..."
        onChange={(e) => setSource(e.target.value)}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={isUploading}
      >
        <option value="">Choose Category:</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large" disabled={isUploading}>
        Post
      </button>
    </form>
  );
}

function CategoryFilter({ setCurrentCategory }) {
  return (
    <aside>
      <ul>
        <li className="category">
          <button
            className="btn btn-all-category"
            onClick={() => setCurrentCategory("all")}
          >
            All
          </button>
        </li>
        {CATEGORIES.map((cat) => (
          <li key={cat.name} className="category">
            <button
              className="btn btn-category"
              onClick={() => setCurrentCategory(cat.name)}
              style={{ backgroundColor: cat.color }}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FactList({ facts, setFact }) {
  if (facts.length === 0) {
    return (
      <p className="message">
        No Facts for this category yet! Create the first one ✌️
      </p>
    );
  }
  return (
    <section>
      <ul className="facts-list">
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} setFact={setFact} />
        ))}
      </ul>
      <p>There are {facts.length} facts in the database. Add your own!!</p>
    </section>
  );
}

function Fact({ fact, setFact }) {
  const [isUpdatingVote, setIsUpdatingVote] = useState(false);

  async function handleVote(columnName) {
    setIsUpdatingVote(true);
    const { data: updatedFact, error } = await supabase
      .from("fact")
      .update({ [columnName]: fact[columnName] + 1 })
      .eq("id", fact.id)
      .select();

    setIsUpdatingVote(false);
    if (!error)
      setFact((facts) =>
        facts.map((f) => (f.id == fact.id ? updatedFact[0] : f))
      );
  }

  return (
    <li className="fact">
      <p>
        {fact.text}
        <a className="source" href={fact.source} target="_blank">
          (Source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: CATEGORIES.find((cat) => cat.name === fact.category)
            .color,
        }}
      >
        {fact.category}
      </span>
      <div className="vote-buttons">
        <button
          onClick={() => handleVote("votesInteresting")}
          disabled={isUpdatingVote}
        >
          👍 {fact.votesInteresting}
        </button>
        <button
          onClick={() => handleVote("votesMindblowing")}
          disabled={isUpdatingVote}
        >
          🤯 {fact.votesMindblowing}
        </button>

        <button
          onClick={() => handleVote("votesFalse")}
          disabled={isUpdatingVote}
        >
          ⛔️ {fact.votesFalse}
        </button>
      </div>
    </li>
  );
}

export default App;
