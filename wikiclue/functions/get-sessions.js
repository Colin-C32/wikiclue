const sessions = new Map();

function createSession() {
	return {
		streakCount: 0,
		timeRemaining: 0,
		skipsRemaining: 0,
		maxTime: 0,
		maxSkips: 0,
		wordsToFind: [],
		token: '',
		timerInterval: null
	};
}

function startTimer(session) {
	if (!session.timerInterval) {
		session.timerInterval = setInterval(() => {
			if (session.timeRemaining > 0) {
				session.timeRemaining -= 1;
			} else {
				clearInterval(session.timerInterval);
				session.timerInterval = null;
				sessions.delete(session.token);
			}
		}, 1000);
	}
}

function getSession(token) {
	let session = sessions.get(token);
	if (!session) {
		session = createSession();
		session.token = token;
		sessions.set(token, session);
	}
	return session;
}

exports.handler = async (event, context) => {
	const { request } = event;
	const token = request.headers.get('Authorization') || '';
	let session;

	if (request.method === 'GET') {
		session = getSession(token);
		return {
			statusCode: 200,
			body: JSON.stringify({
				streakCount: session.streakCount,
				timeRemaining: session.timeRemaining,
				skipsRemaining: session.skipsRemaining,
				maxTime: session.maxTime,
				maxSkips: session.maxSkips,
				wordsToFind: session.wordsToFind
			})
		};
	} else if (request.method === 'POST') {
		const results = await request.json();
		session = getSession(token);
		session.streakCount = results.variables.streakCount;
		session.timeRemaining = results.variables.timeRemaining;
		session.skipsRemaining = results.variables.skipsRemaining;
		session.maxTime = results.variables.maxTime;
		session.maxSkips = results.variables.maxSkips;
		session.wordsToFind = results.variables.wordsToFind;
		startTimer(session);
		return {
			statusCode: 201,
			body: JSON.stringify({ status: 201, token })
		};
	}

	return {
		statusCode: 405,
		body: JSON.stringify({ error: 'Method Not Allowed' })
	};
};
