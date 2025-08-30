import "./App.css";
import AppRoutes from "./routing/Routes";
import { SkeletonTheme } from 'react-loading-skeleton';

function App() {
  return (
    <>
      <SkeletonTheme baseColor="#202020" highlightColor="#444">
        <AppRoutes/>
      </SkeletonTheme>
    </>
  );
}

export default App;
