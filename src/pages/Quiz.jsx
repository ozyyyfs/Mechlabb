import { useState, useEffect, useRef } from 'react';
import { Clock, GraduationCap, RotateCcw } from 'lucide-react';
import { questions } from '../data/quizzes.js';
import { PageHeading, Card, Button } from '../components/UI.jsx';
const categories = [...new Set(questions.map((q) => q.category))];
const shuffle = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};
export default function Quiz({ lab }) {
  const [category, setCategory] = useState('General Mechanical Engineering'),
    [difficulty, setDifficulty] = useState('All levels'),
    [session, setSession] = useState(null),
    [index, setIndex] = useState(0),
    [answer, setAnswer] = useState(null),
    [score, setScore] = useState(0),
    [seconds, setSeconds] = useState(60),
    [finished, setFinished] = useState(false),
    [review, setReview] = useState([]);
  const available = questions.filter(
    (q) => q.category === category && (difficulty === 'All levels' || q.difficulty === difficulty),
  );
  const start = () => {
    setSession(shuffle(available));
    setIndex(0);
    setAnswer(null);
    setScore(0);
    setSeconds(60);
    setFinished(false);
    setReview([]);
    lab.record({
      key: `quiz/${category}`,
      route: 'quizzes',
      name: `${category} quiz`,
      type: 'Quiz',
    });
  };
  useEffect(() => {
    if (!session || finished || answer !== null) return;
    const timer = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [session, index, answer, finished]);
  useEffect(() => {
    if (seconds === 0 && answer === null && session && !finished) {
      setAnswer(-1);
      setReview((r) => [...r, { question: session[index], chosen: -1 }]);
    }
  }, [seconds, session, index, answer, finished]);
  const choose = (value) => {
    if (answer !== null) return;
    setAnswer(value);
    setReview((r) => [...r, { question: session[index], chosen: value }]);
    if (value === session[index].answer) setScore((s) => s + 1);
  };
  const next = () => {
    if (index === session.length - 1) {
      setFinished(true);
      lab.record({
        key: `quiz/${category}`,
        route: 'quizzes',
        name: `${category} quiz`,
        type: 'Quiz',
        score,
        total: session.length,
      });
    } else {
      setIndex(index + 1);
      setAnswer(null);
      setSeconds(60);
    }
  };
  return (
    <>
      <PageHeading
        eyebrow="TEST YOUR UNDERSTANDING"
        title="Mechanical engineering quizzes"
        description="Build confidence with concise questions and useful explanations."
      />
      {!session ? (
        <Card className="padded quiz-start">
          <span className="tile-icon">
            <GraduationCap />
          </span>
          <h2 className="section-space">Choose your challenge</h2>
          <p>
            32 questions across 8 disciplines. You have 60 seconds per question; every answer
            includes an explanation.
          </p>
          <div className="input-grid">
            <label>
              Discipline
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label>
              Difficulty
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                {['All levels', 'Beginner', 'Intermediate', 'Advanced'].map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </label>
          </div>
          <p>
            {available.length} question{available.length !== 1 ? 's' : ''} in this selection.
          </p>
          <div className="actions">
            <Button disabled={!available.length} onClick={start}>
              Start quiz
            </Button>
          </div>
        </Card>
      ) : finished ? (
        <>
          <Card className="padded quiz-results">
            <div className="eyebrow" style={{ justifyContent: 'center' }}>
              CHALLENGE COMPLETE
            </div>
            <h2>{category}</h2>
            <div className="score-ring">
              {score}/{session.length}
            </div>
            <h3>{Math.round((score / session.length) * 100)}% correct</h3>
            <p>Review the explanations below, then try another discipline.</p>
            <div className="actions">
              <Button onClick={start}>
                <RotateCcw size={17} />
                Restart quiz
              </Button>
              <Button variant="secondary" onClick={() => setSession(null)}>
                Choose another quiz
              </Button>
            </div>
          </Card>
          <div className="stack section-space">
            {review.map((r, i) => (
              <Card className="padded" key={i}>
                <span className="meta">
                  {r.chosen === r.question.answer
                    ? 'Correct'
                    : r.chosen === -1
                      ? 'Time expired'
                      : 'Incorrect'}
                </span>
                <h3>{r.question.question}</h3>
                <p>Correct answer: {r.question.options[r.question.answer]}</p>
                <p>{r.question.explanation}</p>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <Card className="padded quiz-start">
          <div className="quiz-status">
            <span>
              Question {index + 1} of {session.length} · {session[index].difficulty}
            </span>
            <span className="inline-flex items-center gap-2" aria-live="off">
              <Clock size={16} />
              {seconds}s
            </span>
          </div>
          <div
            className="quiz-progress"
            role="progressbar"
            aria-label="Quiz progress"
            aria-valuemin={0}
            aria-valuemax={session.length}
            aria-valuenow={index}
          >
            <div style={{ width: `${(index / session.length) * 100}%` }} />
          </div>
          <h2>{session[index].question}</h2>
          <div className="quiz-options">
            {session[index].options.map((option, i) => (
              <button
                disabled={answer !== null}
                key={option}
                className={`quiz-option ${answer !== null && i === session[index].answer ? 'correct' : ''} ${answer === i && i !== session[index].answer ? 'wrong' : ''}`}
                onClick={() => choose(i)}
              >
                <span>{'ABCD'[i]}</span>
                <span>{option}</span>
              </button>
            ))}
          </div>
          {answer !== null && (
            <div className="quiz-feedback" role="status">
              <h3>
                {answer === -1
                  ? 'Time is up'
                  : answer === session[index].answer
                    ? 'Correct answer'
                    : 'Keep learning'}
              </h3>
              <p>{session[index].explanation}</p>
            </div>
          )}
          <div className="actions">
            <Button disabled={answer === null} onClick={next}>
              {index === session.length - 1 ? 'See final score' : 'Next question'}
            </Button>
            <Button variant="secondary" onClick={() => setSession(null)}>
              Exit quiz
            </Button>
          </div>
        </Card>
      )}
    </>
  );
}
