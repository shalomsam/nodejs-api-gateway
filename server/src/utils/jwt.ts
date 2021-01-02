class JwtProvider {
    private base64urlencode(str: string): string {
        return this.urlencode(Buffer.from(str).toString('base64'));
    };

    private urlencode(str: string): string {
        str = (str + '===').slice(0, str.length + (str.length % 4));
        return str.replace(/\-/g, "+").replace(/_/g, "/");
    }
}
