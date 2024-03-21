import Footer from "../Footer";
import Header from "../Header";
import Newsletter from "../Newsletter";

const Layout = ({children}) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Newsletter />
      <Footer />
    </div>
  )
}


export default Layout;