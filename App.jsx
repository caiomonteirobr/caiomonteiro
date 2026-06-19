
import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { CheckCircle2, XCircle, RotateCcw, Trophy, Brain } from "lucide-react";
import "./style.css";

const QUESTIONS = [
  {
    level: "A2",
    category: "Prepositions",
    sentence: "I’m interested ___ learning English.",
    translation: "Estou interessado em aprender inglês.",
    options: ["in", "on", "at", "for"],
    answer: "in",
    explanation: "Use interested in + noun/verb-ing."
  },
  {
    level: "A2",
    category: "Prepositions",
    sentence: "She is good ___ speaking in public.",
    translation: "Ela é boa em falar em público.",
    options: ["at", "in", "on", "to"],
    answer: "at",
    explanation: "Use good at for skills."
  },
  {
    level: "A2",
    category: "Prepositions",
    sentence: "We arrived ___ the airport at 8 p.m.",
    translation: "Chegamos ao aeroporto às 20h.",
    options: ["at", "in", "on", "to"],
    answer: "at",
    explanation: "Use arrive at for specific places like airport, station, office."
  },
  {
    level: "A2",
    category: "Prepositions",
    sentence: "The meeting is ___ Monday.",
    translation: "A reunião é na segunda-feira.",
    options: ["on", "in", "at", "by"],
    answer: "on",
    explanation: "Use on for days of the week."
  },
  {
    level: "A2",
    category: "Prepositions",
    sentence: "I usually wake up ___ 6 a.m.",
    translation: "Eu geralmente acordo às 6h.",
    options: ["at", "in", "on", "by"],
    answer: "at",
    explanation: "Use at for specific times."
  },
  {
    level: "B1",
    category: "Prepositions",
    sentence: "He depends ___ his team.",
    translation: "Ele depende da equipe dele.",
    options: ["on", "in", "of", "for"],
    answer: "on",
    explanation: "The verb depend is usually followed by on."
  },
  {
    level: "B1",
    category: "Prepositions",
    sentence: "This book belongs ___ me.",
    translation: "Este livro pertence a mim.",
    options: ["to", "for", "with", "of"],
    answer: "to",
    explanation: "Use belong to."
  },
  {
    level: "B1",
    category: "Business English",
    sentence: "Let’s follow ___ after the meeting.",
    translation: "Vamos dar continuidade depois da reunião.",
    options: ["up", "on", "in", "over"],
    answer: "up",
    explanation: "Follow up means to continue or check on something later."
  },
  {
    level: "B1",
    category: "Business English",
    sentence: "Could you send the report ___ Friday?",
    translation: "Você poderia enviar o relatório até sexta-feira?",
    options: ["by", "until", "on", "at"],
    answer: "by",
    explanation: "By means no later than a deadline."
  },
  {
    level: "B2",
    category: "Phrasal Verbs",
    sentence: "We need to come ___ with a better plan.",
    translation: "Precisamos pensar em um plano melhor.",
    options: ["up", "out", "in", "over"],
    answer: "up",
    explanation: "Come up with means to create or think of an idea."
  },
  {
    level: "B2",
    category: "Business English",
    sentence: "I’ll get back ___ you tomorrow.",
    translation: "Eu retorno para você amanhã.",
    options: ["to", "for", "at", "with"],
    answer: "to",
    explanation: "Get back to someone means respond later."
  },
  {
    level: "B2",
    category: "Prepositions",
    sentence: "We are responsible ___ managing the campaign.",
    translation: "Somos responsáveis por gerenciar a campanha.",
    options: ["for", "of", "to", "with"],
    answer: "for",
    explanation: "Use responsible for + noun/verb-ing."
  },
  {
    level: "B2",
    category: "Business English",
    sentence: "I’d like to align ___ you on the next steps.",
    translation: "Gostaria de alinhar com você os próximos passos.",
    options: ["with", "to", "for", "about"],
    answer: "with",
    explanation: "Align with someone is commonly used in business contexts."
  },
  {
    level: "C1",
    category: "Business English",
    sentence: "This decision is consistent ___ our global strategy.",
    translation: "Essa decisão é consistente com nossa estratégia global.",
    options: ["with", "to", "for", "at"],
    answer: "with",
    explanation: "Use consistent with."
  },
  {
    level: "C1",
    category: "Business English",
    sentence: "We need to account ___ regional differences.",
    translation: "Precisamos considerar as diferenças regionais.",
    options: ["for", "to", "with", "in"],
    answer: "for",
    explanation: "Account for means consider or explain something."
  }
];

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function App() {
  const [level, setLevel] = useState("All");
  const [category, setCategory] = useState("All");
  const [roundSeed, setRoundSeed] = useState(0);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]);

  const filtered = useMemo(() => {
    return QUESTIONS.filter(q =>
      (level === "All" || q.level === level) &&
      (category === "All" || q.category === category)
    );
  }, [level, category]);

  const deck = useMemo(() => shuffle(filtered).slice(0, 10), [filtered, roundSeed]);
  const current = deck[index];
  const answered = selected !== null;

  function choose(option) {
    if (answered) return;
    setSelected(option);
    const correct = option === current.answer;
    if (correct) setScore(s => s + 1);
    setHistory(h => [...h, { ...current, selected: option, correct }]);
  }

  function next() {
    if (index < deck.length - 1) {
      setIndex(i => i + 1);
      setSelected(null);
    }
  }

  function restart() {
    setRoundSeed(s => s + 1);
    setIndex(0);
    setSelected(null);
    setScore(0);
    setHistory([]);
  }

  function changeFilter(type, value) {
    if (type === "level") setLevel(value);
    if (type === "category") setCategory(value);
    setTimeout(restart, 0);
  }

  if (!current) {
    return (
      <main className="page">
        <section className="shell">
          <h1>English Training Game</h1>
          <p>Nenhuma pergunta encontrada para esse filtro.</p>
          <button onClick={() => { setLevel("All"); setCategory("All"); restart(); }}>Resetar filtros</button>
        </section>
      </main>
    );
  }

  const progress = ((index + (answered ? 1 : 0)) / deck.length) * 100;
  const finished = index === deck.length - 1 && answered;

  return (
    <main className="page">
      <section className="shell">
        <header className="header">
          <div>
            <p className="eyebrow">Mini Duolingo corporativo</p>
            <h1>English Training Game</h1>
          </div>
          <div className="score">
            <Trophy size={18} />
            {score}/{deck.length}
          </div>
        </header>

        <div className="filters">
          <select value={level} onChange={e => changeFilter("level", e.target.value)}>
            <option value="All">Todos os níveis</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="C1">C1</option>
          </select>

          <select value={category} onChange={e => changeFilter("category", e.target.value)}>
            <option value="All">Todas as categorias</option>
            <option value="Prepositions">Prepositions</option>
            <option value="Business English">Business English</option>
            <option value="Phrasal Verbs">Phrasal Verbs</option>
          </select>
        </div>

        <div className="progress">
          <div style={{ width: `${progress}%` }} />
        </div>

        <section className="question">
          <div className="meta">
            <span>{current.level}</span>
            <span>{current.category}</span>
            <span>Pergunta {index + 1} de {deck.length}</span>
          </div>
          <h2>{current.sentence}</h2>
          <p>{current.translation}</p>
        </section>

        <section className="options">
          {shuffle(current.options).map(option => {
            const isCorrect = answered && option === current.answer;
            const isWrong = answered && option === selected && option !== current.answer;
            return (
              <button
                key={option}
                onClick={() => choose(option)}
                className={`option ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`}
                disabled={answered}
              >
                {option}
              </button>
            );
          })}
        </section>

        <section className={`feedback ${answered ? (selected === current.answer ? "good" : "bad") : ""}`}>
          {!answered && (
            <>
              <Brain size={20} />
              <span>Escolha a opção que completa melhor a frase.</span>
            </>
          )}
          {answered && selected === current.answer && (
            <>
              <CheckCircle2 size={22} />
              <span><strong>Correct!</strong> {current.explanation}</span>
            </>
          )}
          {answered && selected !== current.answer && (
            <>
              <XCircle size={22} />
              <span><strong>Not this one.</strong> A resposta correta é <strong>{current.answer}</strong>. {current.explanation}</span>
            </>
          )}
        </section>

        <footer className="actions">
          <button className="secondary" onClick={restart}>
            <RotateCcw size={18} /> Reiniciar
          </button>
          {!finished ? (
            <button className="primary" onClick={next} disabled={!answered}>Próxima</button>
          ) : (
            <button className="primary" onClick={restart}>Jogar novamente</button>
          )}
        </footer>

        {finished && (
          <section className="summary">
            <h3>Resumo da rodada</h3>
            <p>Você fez <strong>{score}</strong> de <strong>{deck.length}</strong>.</p>
            <div className="review">
              {history.map((item, i) => (
                <div key={i} className="reviewItem">
                  <strong>{item.correct ? "✅" : "❌"} {item.sentence}</strong>
                  <span>Sua resposta: {item.selected} · Correta: {item.answer}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
