import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Resume from './components/Resume';
import ThemeContext from './contexts/ThemeContext';

const themeColors = {
  accentColor: "#6F1110",
  backgroundColor: "#EDEBDD",
  darkTextColor: "#1B1717",
  lightTextColor: "#EDEBDD"
};

function App() {
  return (
    <ThemeContext.Provider value={themeColors}>
      <div className="app-container" style={{ backgroundColor: themeColors.backgroundColor, color: themeColors.darkTextColor }}>
        <Header />
        <main>
          <Hero />
        </main>
        <Resume />
        <Resume />
      </div>
    </ThemeContext.Provider>
  )
}

export default App
