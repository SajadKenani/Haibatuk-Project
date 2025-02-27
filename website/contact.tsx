import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import arabic from "./arabic.json";
import english from "./english.json";
import { RootState } from "./store";
import { useSelector } from "react-redux";
import contact from "./assests/images/contact.png"

export const CONTACT = () => {

    const lang = useSelector((state: RootState) => state.language);

    // Choose language based on current state
    const lan = lang === "arabic" ? arabic : english;

    // Dynamically set the text direction based on the language
    const textDirection = lang === "arabic" ? "end" : "start";
    const theme = useSelector((state: RootState) => state.theme);

 

    return (
        <>
            <div className="flex justify-center mt-16 mb-32 relative mt-40">
                {/* Main Contact Section */}
                <div
                    className={`font-sans text-center ${theme === "light" ? "text-gray-800" : "text-white"
                        } p-8 shadow-xl rounded-lg w-full lg:w-2/3 bg-${theme === "light" ? "white" : "gray-800"}`}
                    id="contact-us"
                >
                    {/* Contact Section Header */}
                    <div className="text-left mb-8 mr-0 lg:mr-16">
                        <h2
                            className="text-teal-600 text-3xl font-bold"
                            style={{ textAlign: textDirection }}
                        >
                            {lan.contact_us_button}
                        </h2>
                        <p
                            className="text-lg mt-3"
                            style={{ textAlign: textDirection }}
                        >
                            {lan.contact_us_description}
                        </p>
                    </div>

                    {/* Contact Details and Illustration */}
                    <div className={`flex flex-col lg:flex-row ${lan === arabic && "lg:flex-row-reverse"
                        } justify-between gap-8`}>
                        {/* Contact Details */}
                        <div className="w-full lg:w-1/2 mt-10 ">
                            <ul className="list-none space-y-4">
                                <li className={`flex items-center gap-4 text-lg ${lan === arabic && "lg:flex-row-reverse lg:mr-16"}`}>
                                    <FaMapMarkerAlt className="text-teal-600 text-2xl " />
                                    <span>{lang === "arabic" ? "العراق، بغداد" : "Iraq, Baghdad"}</span>
                                </li>
                                <li className={`flex items-center gap-4 text-lg ${lan === arabic && "lg:flex-row-reverse lg:mr-16"}`}>
                                    <FaPhone className="text-teal-600 text-2xl" />
                                    <div className="space-y-2">
                                        <a href="tel:+9647722995020" >
                                            +9647722995020
                                        </a>
                                        <> / </>
                                        <a href="tel:+9647811478551" >
                                            +9647811478551
                                        </a>
                                    </div>

                                </li>
                                <li className={`flex items-center gap-4 text-lg ${lan === arabic && "lg:flex-row-reverse lg:mr-16"}`}>
                                    <FaEnvelope className="text-teal-600 text-2xl" />
                                    <span>info@haibatuk.com</span>
                                </li>
                            </ul>
                        </div>

                        {/* Illustration */}
                        <div className="w-full lg:w-1/2 flex justify-center">
                            <img
                                src={contact}
                                alt="Contact Illustration"
                                className="w-3/4 rounded-lg "
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

