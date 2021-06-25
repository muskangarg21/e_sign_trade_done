import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';


const toastDisplay = function (data, type) {

    if (typeof data === "object") {
        data = data.message
    }

    if (type === "success") {
        toast.success("✔️  " + data, {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            className: "rounded-lg"
        });
    }
    else if (type === "error") {
        toast.error("✘  " + data, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            className: "rounded-lg"
        });
    }
    else if (type === "info") {
        toast.info("🔔  " + data, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            className: "rounded-lg"
        });
    }
    else if (type === "warn") {
        toast.warn("⚠️  " + data, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            className: "rounded-lg"
        });
    }
}

export default toastDisplay;