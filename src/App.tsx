import './App.css';
import CharacterList from './components/CharacterList';
import Footer from '../src/footer/footer'

const App = () => {
  return (
    <div className="App">
      <main>
        <CharacterList />
        
      </main>
      <Footer/>
    </div>
  );
}

export default App;
