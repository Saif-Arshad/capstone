import { carsData } from '../shared/ProductData'
import CarCard from '../shared/CarCard'

function Customization() {
    return (
        <div className="pt-36 px-4 sm:px-10">
            <h2 className="text-2xl md:text-4xl text-start font-bold mb-6">
                Explore, Customize and Purchase <br /> the automobile parts
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2  3xl:grid-cols-3 pt-20 gap-8">
                {carsData.map((item) => (
                    <CarCard key={item.id} item={item} />
                ))}
            </div>
        </div>

    )
}

export default Customization