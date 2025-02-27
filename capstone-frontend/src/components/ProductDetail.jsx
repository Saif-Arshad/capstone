import { useParams } from "react-router-dom";
import Detail from './engine_2';
function ProductDetail() {
    const { id } = useParams(); 
    return (
        <Detail id={id}/>
    )
}

export default ProductDetail