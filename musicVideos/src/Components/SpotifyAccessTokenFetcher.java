import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.io.UnsupportedEncodingException;
import java.util.Properties;


public class SpotifyAccessTokenFetcher {
    public static void main(String[] var0) {
        Properties properties = new Properties();

        try {
            FileInputStream fileInput = new FileInputStream("config.properties");
            properties.load(fileInput);
            fileInput.close();
        } catch (IOException e) {
            e.printStackTrace();
            return;
        }

        String clientId = properties.getProperty("spotify.clientId");
        String clientSecret = properties.getProperty("spotify.clientSecret");


        String var1 = "https://accounts.spotify.com/api/token";
        String encodedGrantType = "grant_type=" + urlEncode("client_credentials");
        String encodedClientId = "client_id=" + clientId;
        String encodedClientSecret = "client_secret=" + clientSecret;
        String var5 = encodedGrantType + "&" + encodedClientId + "&" + encodedClientSecret;

        try {
            URL var6 = new URL(var1);
            HttpURLConnection var7 = (HttpURLConnection) var6.openConnection();
            var7.setRequestMethod("POST");
            var7.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            var7.setDoOutput(true);
            OutputStream var8 = var7.getOutputStream();

            try {
                byte[] var9 = var5.getBytes(StandardCharsets.UTF_8);
                var8.write(var9);
            } catch (Throwable var18) {
                if (var8 != null) {
                    try {
                        var8.close();
                    } catch (Throwable var15) {
                        var18.addSuppressed(var15);
                    }
                }

                throw var18;
            }

            if (var8 != null) {
                var8.close();
            }

            int var22 = var7.getResponseCode();
            StringBuilder var23 = new StringBuilder();
            BufferedReader var10 = new BufferedReader(new InputStreamReader(var7.getInputStream()));

            String var11;
            try {
                while ((var11 = var10.readLine()) != null) {
                    var23.append(var11);
                }
            } catch (Throwable var19) {
                try {
                    var10.close();
                } catch (Throwable var14) {
                    var19.addSuppressed(var14);
                }

                throw var19;
            }

            var10.close();
            System.out.println("JSON Response: " + var23.toString());
        } catch (IOException var20) {
            var20.printStackTrace();
        }
    }

    // Other methods (urlEncode and parseAccessToken) remain the same...



    private static String urlEncode(String value) {
        try {
            return URLEncoder.encode(value, StandardCharsets.UTF_8.toString());
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            return value;
        }
    }

    private static String parseAccessToken(String var0) {
        int var1 = var0.indexOf("\"access_token\":\"") + 15;
        int var2 = var0.indexOf("\"", var1);
        return var0.substring(var1, var2);
    }
}
