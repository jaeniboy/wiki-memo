//import './App.css';

function App() {
  return (
    <>
      <Board>
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </Board>
    </>
  );
}

function Board({children}) {
  return (
    <div className="board vw-75 min-vh-100">
        {children}
    </div>
  )
}

function Card() {
  return (
    <div className="card">
    </div>
  )
}

export default App;
