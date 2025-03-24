export default function Layout(props){

    const { children } = props;

    const header = (
        <header>
            <h1 className="text-gradient">The Brogram</h1>
            <p><strong>The 30 Simple Workouts Programs</strong></p>
        </header>
    )

    const footer = (
        <footer>
            <p>Built By <a target="_blank" 
            href="https://www.arunkrishna.com">Arunkrishna</a>
            <br />Styled with<a target="_blank" 
            href="https://www.fatacss.smoljames.com">FantaCss</a></p>
        </footer>
    )

    //https://www.YOUR_USERNAME.netlify.app

    return(
        <>
            {header}
            {children}
            {footer}

        </>
    )
}