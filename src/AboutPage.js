import { Link } from "react-router-dom";

const AboutPage = () => {
    document.title = "Migrations | About"
    const linkClasses = "text-blue-600 dark:text-blue-500 hover:underline"
    const goToRust = "/?query=%7E%27*22go*22*2c*20*22rust*22"
    const mongoToPostgres = "/?query=~%27mongo*2c*20postgres"
    const herokoToKubernetes = "/?query=%7E%27*22heroku*22*2c*20kubernetes"
    const WaveEmoji = (
        <span role="img" aria-label="wave">👋</span>
    )
    return (
        <div className="container mx-auto text-left">
            <h2 className="text-4xl mb-2 font-extrabold dark:text-white">Hello {WaveEmoji}</h2>
            <p className="mb-2 dark:text-white">
                This is a dataset for migrations, like <Link to={goToRust} className={linkClasses}>Go to Rust</Link> or <Link to={mongoToPostgres} className={linkClasses}>MongoDB to Postgres</Link>. The data is mostly sourced from blog posts that have appeared on <a href="https://news.ycombinator.com/" className={linkClasses}>Hacker News</a>.
            </p>
            <p className="mb-2 dark:text-white">
                This was built by me (<a href="https://www.bilbof.com" className={linkClasses}>
                    Bill Franklin
                </a>), after I attended Richard's <a href="https://www.youtube.com/watch?v=mpY1lxkikqM" className={linkClasses}>talk</a> at DevopsDaysLondon about the GOV.UK infrastructure migration, which I had worked on.
            </p>
            <p className="mb-2 dark:text-white">
                I thought it would be useful for future infrastructure migrations to have a dataset of previous migrations to learn from. The initial data was scraped from Hacker News, and accidentally included more migrations than intended (e.g. <Link to="/migrations/table?query=~%27*22seattle*22*2c*20*22california*22" className={linkClasses}>Seattle to California</Link>).
            </p>
            <p className="mb-2 dark:text-white">
                You can see how migrations change over time, filtered by segment, and custom search queries (e.g. <Link to={herokoToKubernetes} className={linkClasses}><pre style={{display: "inline"}}>"heroku", kubernetes</pre></Link>, will perform an exact match on Heroku with a fuzzy match on kubernetes). Some interesting patterns emerge (Rubyists moving to Node.JS and then Go), and some ideas for migrations, including <Link to="/migrations/?query=~%27*22reactjs*22*2c*20*22nextjs*22" className={linkClasses}>ReactJS to NextJS</Link> and <Link to="/migrations/?query=~%27*22netlify*22" className={linkClasses}>Google Kubernetes Engine to Netlify</Link>.
            </p>
            <p className="mb-2 dark:text-white">
                The code is open source on GitHub, which you can find at <a href="https://github.com/bilbof/migrations" className={linkClasses}>bilbof/migrations</a>.
                You can help improve the dataset and derived statistics and graphs by <Link to="https://ixybtynp6db.typeform.com/to/KSZKLuJE" className={linkClasses}>adding migrations</Link>.
            </p>
            <p className="mb-2 space-y-1 text-gray-900 list-disc list-inside dark:text-gray-400">
                Got other feedback? Email me at <Link to="mailto:bill@bigbucket.io" className={linkClasses}>bill@bigbucket.io</Link>. You can support this site by <a href="https://www.buymeacoffee.com/billfranklin" className={linkClasses}>buying me a coffee</a>.
            </p>
        </div>
    )

}

export default AboutPage