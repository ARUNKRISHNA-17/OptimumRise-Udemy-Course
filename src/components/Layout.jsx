export default function Layout(props){

    const { children } = props;

    const header = (
        <header>
            <h1 className="text-gradient">OptimumRise</h1>
            <p><strong>The 30 Simple Workouts Programs for your rise into the fitness world.</strong></p>
        </header>
    )

    const footer = (
        <footer>
            <p>Built By <a target="_blank" 
            href="https://www.arunkrishna.com">Arunkrishna</a>
            <br />Styled with<a target="_blank" 
            href="https://www.fantacss.smoljames.com">FantaCss</a></p>
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