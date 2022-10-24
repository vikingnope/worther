import { Header } from "../components/utils/header";
import { Footer  } from "../components/utils/footer";

export default function Recommendations () {
  return (
    <div className='select-none text-white'>
        <Header choice={'recommendations'}/>
        <div className="text-center bg-black flex min-h-screen flex-col">
            <p className="text-5xl font-bold underline mt-3">Recommendations</p>
        </div>
        <Footer />
    </div>
  )
}