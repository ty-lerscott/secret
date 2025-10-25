import { type NextRequest, NextResponse } from 'next/server';
import { 
    guid,
    cuid2,
    uuidV4,
    unicodeUID,
    uuidVersionless,
} from '@/app/lib/utils';

const fillArrayWithSecrets = (array: string[], secretFunc: () => string) => {
    return array.map(item => {
        return secretFunc();
    })
}
export async function GET(req: NextRequest) {
    try {
        const params = new URLSearchParams(req.nextUrl.searchParams);
        const type = params.get('type');
        const count = Number(params.get('count'));

        let secret: string[] = Array(count || 1).fill("");

        switch(type) {
            case 'guid':
                secret = fillArrayWithSecrets(secret, () => guid().toString())
                break;
            case 'uuid_wild':
                secret = fillArrayWithSecrets(secret, uuidVersionless)
                break;
            case 'unicode':
                secret = fillArrayWithSecrets(secret, unicodeUID)
                break;
            case 'cuid':
            case 'cuid2':
                secret = fillArrayWithSecrets(secret, cuid2)
                break;
            case 'uuid':
            default:
                secret = fillArrayWithSecrets(secret, uuidV4)
                break;
        }
        return NextResponse.json({
            type,
            count,
            ids: secret
        })
    } catch (err) {
        return NextResponse.json({
            error: "error fetching secret"
        })
    }
}
