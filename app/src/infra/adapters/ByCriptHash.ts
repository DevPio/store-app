import { IHash } from "../database/HashInterface";
import bcrypt from 'bcrypt'

export class BcryptHash implements IHash {
    sountRounds: number = 10
    async hash(data: string): Promise<string> {
        const genSalt = await bcrypt.genSalt(this.sountRounds)
        const hash = await bcrypt.hash(data, genSalt)

        return hash
    }
    async compare(data: string, hashed: string): Promise<boolean> {

        return await bcrypt.compare(data, hashed)
    }

}