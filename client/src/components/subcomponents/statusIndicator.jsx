const StatusIndicator = (props) => {

    if (props.status) {
        return (
            <div className="inline-flex">
                <div className="w-6 h-6 ml-2 rounded-full bg-green-500"></div>
                <div className="w-6 h-6 ml-2 rounded-full bg-red-200"></div>
            </div>
        );
    } else {
        return (
            <div className="inline-flex">
                <div className="w-6 h-6 ml-2 rounded-full bg-green-200"></div>
                <div className="w-6 h-6 ml-2 rounded-full bg-red-500"></div>
            </div>
        );
    }

    
}

export default StatusIndicator;