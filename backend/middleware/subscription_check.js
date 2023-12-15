const { Subscription } = require("../models/Subscription");
const stripe = require("../utils/Stripe");
const { getStripeSubscriptionId } = require("../utils/Stripe_utils");

const checkSubscription = async (req, res, next) => {
	try {
		var subscription = await Subscription.findOne({ owner: req.user._id });
		if (!subscription)
			subscription = await Subscription.findOne({
				shared_with: req.user._id,
			});
		if (subscription) {
			const stripeSubscription = await stripe.subscriptions.retrieve(
				subscription.stripe_subscription_id
			);
			console.log(stripeSubscription);
			if (stripeSubscription.status == "active") return next();

			await Subscription.deleteOne({ _id: subscription._id });
			return res.status(403).send({ message: "No active subscription" });
		}

		const stripeSubscriptionId = await getStripeSubscriptionId(
			req.user._id
		);
		if (!stripeSubscriptionId)
			return res.status(403).send({ message: "No active subscription" });

		await new Subscription({
			owner: req.user._id,
			stripe_subscription_id: stripeSubscriptionId,
			sharing_code: "",
			sharing_users_limit: 5,
			shared_with: [],
		}).save();
		next();
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "server error" });
	}
};

module.exports = checkSubscription;
