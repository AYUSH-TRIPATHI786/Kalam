import Dashboard from "@/components/Dashboard";
import { db } from "@/db";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation";

const Page = async () => {
    const {getUser} = getKindeServerSession();
    const user = await getUser();
    if(!user || !user.id) redirect('/auth-callback?origin=dashboard')
    
    const dbUser = await db.user.findFirst({
        where: {
            kindeId: user.id
        }
    })
    if(!dbUser) redirect('/auth-callback?origin=dashboard')
    const {isSubscribed} = await getUserSubscriptionPlan()
    return <Dashboard isSubscribed={isSubscribed}/>
}

export default Page