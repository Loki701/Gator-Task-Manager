import Register from './Register';
import Login from './Login';
import Home from "./Home";
import MoodTracker from './MoodTracker';



export default function App() {
  let component;
  switch(window.location.pathname){
    case "/":
      component = <Login/>
      break;
    case "/Register":
      component = <Register/>
      break;
    case "/Home":
      component = <Home/>
      break;
    case "/MoodTracker":
      component = <MoodTracker />
      break;
  }
  return(
    <main className='App'>
      {component}
    </main>
  );
}