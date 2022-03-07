declare global {
    namespace NodeJS {
        interface ProcessEnv {
            botToken: string;
            guildId: string;
            mongoURI: string;
            enviroment: "dev" | "prod" | "debug";
        }
    }
}

export {}