const Subscription = require("../models/Subscription");

const createSubscriptionService = async (subscriptionDetails) => {
    try {
        console.log(subscriptionDetails);
        const subscription = await Subscription.create({
            name: subscriptionDetails.name,
            slug: subscriptionDetails.slug,
            description: subscriptionDetails.description,
            price: subscriptionDetails.price,
            duration: subscriptionDetails.duration,

        });
        return subscription;
    } catch (error) {
        return { status: "fail", data: error.toString() };
    }
};

module.exports = createSubscriptionService;