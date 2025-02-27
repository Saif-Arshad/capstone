/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import '@google/model-viewer';
import { IoIosArrowForward } from 'react-icons/io';
import { Link } from 'react-router-dom';
function CarCard({ item }) {
    const modelRef = useRef(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const modelViewer = modelRef.current;
       if (!modelViewer) return;

        function handleLoad() {
            setLoading(false);
        }

        modelViewer.addEventListener('load', handleLoad);

        return () => {
            modelViewer.removeEventListener('load', handleLoad);
        };
    }, []);

    return (
        <div
         className="bg-slate-50  w-full flex flex-col p-4 rounded-2xl "
         >
            <div className="w-full h-52 relative mb-4">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 text-gray-800">
                        Loading 3D Model...
                    </div>
                )}
                <model-viewer
                    ref={modelRef}
                    src={item.modelSrc}
                    camera-controls
                    auto-rotate
                    scale="3 3 3"
                    style={{ width: '100%', height: '100%' }}
                    alt={item.title}
                ></model-viewer>
            </div>
            <h3 className="text-3xl text-start font-bold my-2">{item.title}</h3>
            <p className="text-gray-600 text-start mb-2">{item.description.slice(0,180)}...</p>
            <div className="flex items-center justify-end">
                <Link
                    to={`/product/${item.id}`}
                    className="bg-[#ff4d30]  text-white flex mt-8 items-center gap-2 justify-center py-4 px-4 lg:px-8 transition-all duration-300 ease-linear hover:bg-transparent hover:text-black rounded-full border-2 border-[#ff4d30]"
                >
                    <span>Detail</span>
                    <span className="text-xl">
                        <IoIosArrowForward />
                    </span>
                </Link>
            </div>
        </div>
    );
}

export default CarCard;
