import {app} from './app';

const port = process.env.PORT || 3003;
app.listen(port, () => {
	console.log(`Payment service listening on port ${port}`);
});
