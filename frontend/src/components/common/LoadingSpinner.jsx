const LoadingSpinner = ({ size = "md" }) => {//by default size=md if nothing passed as arg
	const sizeClass = `loading-${size}`;

	return <span className={`loading loading-spinner ${sizeClass}`} />;//see daisy ui loading
};
export default LoadingSpinner;