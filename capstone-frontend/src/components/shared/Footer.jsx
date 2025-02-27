import { BsFillTelephoneFill } from "react-icons/bs";
import { GrMail } from "react-icons/gr";
import { Link, useLocation } from "react-router-dom";
import logo from "/Screenshot_3.png";


function Footer() {
    const location = useLocation();
    const path = location.pathname;
    if (path.startsWith("/dashboard")) {
        return
    }
    return (
        <section id="footer">
            <div className=" bg-white px-8 lg:px-28 py-2 pt-16  text-center space-y-4 ">
                <h1 className=" font-bold text-2xl lg:text-4xl leading-tight ">Find Us</h1>
                <iframe
              
                    className="w-full h-80"
                    src=" https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3634.9535084163454!2d54.515143699999996!3d24.3481121!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5e41a89caf646b%3A0xfb22d24ab0f60412!2sB3%20Custom%20MotorSport!5e0!3m2!1sen!2s!4v1739199756834!5m2!1sen!2s"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Maps Embed"
                ></iframe>
            </div>
            <div className="bg-[#f8f8f8] px-8 lg:px-28 py-16 text-center grid grid-cols-1 lg:grid-cols-3 lg:text-left gap-20">
                <div className="space-y-6">
                    <div className="space-y-4">
                        <Link to="/">
                            <img
                                src={logo}
                                alt="logo"
                                width={140}
                                className="mb-7"
                                height={140}
                            />
                        </Link>
                        <p className="text-custom-grey">
                            Transform your vehicle with the best aftermarket accessories in the UAE
                        </p>
                    </div>
                    <div>
                        <ul className="space-y-2 mt-4">
                            <li>
                                <Link
                                    href="tel:123456789"
                                    className="flex items-center justify-center lg:justify-start gap-2 hover:text-custom-orange transition-all duration-300 ease-linear"
                                >
                                    <span>
                                        <BsFillTelephoneFill />
                                    </span>
                                    <span className="font-semibold">(123)-456-789</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="support@roadrunnerauto.com"
                                    className="flex items-center justify-center lg:justify-start gap-2 hover:text-custom-orange transition-all duration-300 ease-linear"
                                >
                                    <span>
                                        <GrMail />
                                    </span>
                                    <span className="font-semibold">support@roadrunnerauto.com</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="space-y-4">
                    <h1 className="font-bold text-2xl">Quick Links</h1>
                    <ul className="space-y-2">
                        <li>
                            <a
                                href="#top"
                                className="hover:text-custom-orange transition-all duration-300 ease-linear"
                            >
                                Home
                            </a>
                        </li>
                        <li>
                            <Link
                                to="/products"
                                className="hover:text-custom-orange transition-all duration-300 ease-linear"
                            >
                                Shop Auto Parts
                            </Link>
                        </li>
                      
                        <li>
                            <Link
                                to="/custom"
                                className="hover:text-custom-orange transition-all duration-300 ease-linear"
                            >
                                Customization
                            </Link>
                        </li>

                    </ul>
                </div>

                <div className="space-y-6">
                    <div className="space-y-4">
                        <h1 className="font-bold text-2xl uppercase"> Newsletter</h1>
                        <p className="text-custom-grey mb-2">
                            Stay updated on the latest car parts & exclusive deals!
                        </p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <input
                            type="email"
                            className="bg-gray-200 rounded p-4 placeholder:text-custom-grey"
                            placeholder="Enter Email Address"
                        />
                        <button className="bg-[#ff4d30] p-4 cursor-pointer font-bold text-white rounded shadow-orange-bottom hover:shadow-orange-bottom-hov transition-all duration-300 ease-linear">
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
export default Footer;
