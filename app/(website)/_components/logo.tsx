import Image from "next/image"
import { Poppins  } from "next/font/google"
import { cn } from "@/lib/utils" 


const font = Poppins({
    weight: ['400', '600'],
    subsets: ['latin'],
    variable: '--font-poppins'
})
 
export const Logo = () => {
    return (
        <div className="hidden md:flex items-center gap-x-2" >
            <Image src="/logo-light.png" alt="Logo" width={34} height={34} />
            <p className={cn("font-semibold", font.className)}>
                Trojan
            </p>
        </div>
    )
}