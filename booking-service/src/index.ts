import {app} from './app';

const port = process.env.PORT || 3005;
app.listen(port, () => {
	console.log(`Booking service listening on port ${port}`);
});
