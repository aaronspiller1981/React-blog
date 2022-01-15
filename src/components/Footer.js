

const Footer = () => {
    const today = new Date();
    return (
        <footer className="Footer">
            <p>Copyright &copy; Aaron Spiller {today.getFullYear()}</p>
        </footer>
    )
}

export default Footer
