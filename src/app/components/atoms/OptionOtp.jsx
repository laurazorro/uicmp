import PropTypes from 'prop-types';
import Icon from "./Icon";

export default function OptionOtp({ option, onSelect, children }) {
    const OtpMethod = {
        mail:{
            title: "Icono correo",
            route: "/mail_icon.svg",
            id: "mail",
            value: "mail",
            text: "Recibirás un código de verificación",
        },
        sms: {
            title: "Icono teléfono móvil",
            route: "/phone_icon.svg",
            id: "phone",
            value: "phone",
            text: "Recibirás un mensaje de texto (SMS)",
        } 
    };
    return(
        <>
        <input
            type="radio"
            id={OtpMethod[option].id}
            name="otp"
            value={OtpMethod[option].value}
            className="hidden peer"
            onClick={() => onSelect(OtpMethod[option].value)}
            required
        />
        <label
            htmlFor={OtpMethod[option].id}
            className="inline-flex items-center w-full p-2 text-gray-600 bg-white border border-gray-600 rounded-full cursor-pointer peer-checked:border-orange-600 peer-checked:text-orange-600 hover:border-orange-600 peer-checked:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
            value={OtpMethod[option].value}
            >
            <Icon route={OtpMethod[option].route} title={OtpMethod[option].title}/>
            <div className="block ml-2">
            
            <div className="w-full text-xs">{OtpMethod[option].text}</div>
            <div className="text-sm text-left font-semibold">{ children }</div>
            </div>
        </label>
        </>
    );
} 

OptionOtp.propTypes = {
  option: PropTypes.string.isRequired,
  onSelect: PropTypes.func,
  children: PropTypes.string,
};

OptionOtp.defaultProps = {
  onSelect: () => {}
};