import $ from 'cafy'; import ID from '../../../../../misc/cafy-id';
import cancelFollowRequest from '../../../../../services/following/requests/cancel';
import User, { pack, ILocalUser } from '../../../../../models/user';

export const meta = {
	desc: {
		ja: '自分が作成した、指定したフォローリクエストをキャンセルします。',
		en: 'Cancel a follow request.'
	},

	requireCredential: true,

	kind: 'following-write'
};

export default (params: any, user: ILocalUser) => new Promise(async (res, rej) => {
	// Get 'userId' parameter
	const [followeeId, followeeIdErr] = $.type(ID).get(params.userId);
	if (followeeIdErr) return rej('invalid userId param');

	// Fetch followee
	const followee = await User.findOne({
		_id: followeeId
	});

	if (followee === null) {
		return rej('followee not found');
	}

	await cancelFollowRequest(followee, user);

	// Send response
	res(await pack(followee._id, user));
});
