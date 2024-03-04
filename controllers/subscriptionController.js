const Response = require("../helpers/response");
const createSubscriptionService = require("../services/subscriptionService");

const createSubscription = async (req, res) => {
    try {
        const { name, price, duration, description } = req.body;
        console.log(name, price, duration, description);
        if(!name) {
            return res.status(400).json(Response({
                message: 'Subscription  name is required'
            }));
        }
        if(!price) {
            return res.status(400).json(Response({
                message: 'Subscription price is required'
            }));
        }
        if(!duration) {
            return res.status(400).json(Response({
                message: 'Subscription duration is required'
            }));
        }

        let subscriptionDetails = {
            name,
            price,
            duration,
            description,
            slug: name.toLowerCase().split(' ').join('-')
        };

        let subscription = await createSubscriptionService(subscriptionDetails);

        res.status(200).json(Response({
            message: "Subscription created successfully",
            data: subscription,
            status: "Okay",
            statusCode: 200,
            type: "Subscription"
        }))
        
    } catch (error) {
        res.status(500).json(Response({message: "Internal server error"}))
    }
};

module.exports = {
    createSubscription
}