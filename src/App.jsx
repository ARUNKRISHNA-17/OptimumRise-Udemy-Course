import Grid from "./components/Grid"
import Hero from "./components/Hero"
import Layout from "./components/Layout"
import logo from "./utils/brogram_bg.png"


function App() {

  return (

    <Layout>
      <main>
        <Hero />
        <Grid />
      </main>
    </Layout>
  )
}

export default App
