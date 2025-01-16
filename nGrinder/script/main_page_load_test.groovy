import static net.grinder.script.Grinder.grinder
import static org.junit.Assert.*
import static org.hamcrest.Matchers.*
import net.grinder.script.GTest
import net.grinder.script.Grinder
import net.grinder.scriptengine.groovy.junit.GrinderRunner
import net.grinder.scriptengine.groovy.junit.annotation.BeforeProcess
import net.grinder.scriptengine.groovy.junit.annotation.BeforeThread
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.ngrinder.http.HTTPRequest
import org.ngrinder.http.HTTPRequestControl
import org.ngrinder.http.HTTPResponse
import org.ngrinder.http.cookie.Cookie
import org.ngrinder.http.cookie.CookieManager

@RunWith(GrinderRunner)
class TestRunner {

    public static GTest test
    public static HTTPRequest request
    public static Map<String, String> headers = [:]
    public static Map<String, Object> params = [:]
    public static List<Cookie> cookies = []

    @BeforeProcess
    public static void beforeProcess() {
        HTTPRequestControl.setConnectionTimeout(300000)
        test = new GTest(1, "juchumjuchum.site")
        request = new HTTPRequest()
        grinder.logger.info("before process.")
    }

    @BeforeThread
    public void beforeThread() {
        test.record(this, "testThemeChange")
        test.record(this, "testStockFluctuation")
        test.record(this, "testTopViews")
        test.record(this, "testIndex")
        test.record(this, "testStatus")
        grinder.statistics.delayReports = true
        grinder.logger.info("before thread.")
    }

    @Before
    public void before() {
        request.setHeaders(headers)
        CookieManager.addCookies(cookies)
        grinder.logger.info("before. init headers and cookies")
    }

    @Test
    public void testThemeChange() {
        HTTPResponse response = request.GET("http://juchumjuchum.site/api/user/theme")
        if (response.statusCode == 301 || response.statusCode == 302) {
            grinder.logger.warn("Warning. The response may not be correct. The response code was {}.", response.statusCode)
        } else {
            assertThat(response.statusCode, is(200))
            if (response.statusCode != 200) {
                grinder.logger.warn("Warning. The response may not be correct. The response code was {}.", response.statusCode)
            }
        }
    }


    @Test
    public void testStockFluctuation() {
        Map<String, Object> params = ["limit": "10", "type": "increase"]
        HTTPResponse response = request.GET("http://juchumjuchum.site/api/stock/fluctuation", params)
        if (response.statusCode == 301 || response.statusCode == 302) {
            grinder.logger.warn("Warning. The response may not be correct. The response code was {}.", response.statusCode)
        } else {
            grinder.logger.info("Response Status Code: ${response.statusCode}")
            assertThat(response.statusCode, is(200))
        }
    }

    @Test
    public void testTopViews() {
        Map<String, Object> params = ["limit": "5"]
        HTTPResponse response = request.GET("http://juchumjuchum.site/api/stock/topViews", params)
        if (response.statusCode == 301 || response.statusCode == 302) {
            grinder.logger.warn("Warning. The response may not be correct. The response code was {}.", response.statusCode)
        } else {
            grinder.logger.info("Response Status Code: ${response.statusCode}")
            assertThat(response.statusCode, is(200))
        }
    }

    @Test
    public void testIndex() {
        HTTPResponse response = request.GET("http://juchumjuchum.site/api/stock/index")
        if (response.statusCode == 301 || response.statusCode == 302) {
            grinder.logger.warn("Warning. The response may not be correct. The response code was {}.", response.statusCode)
        } else {
            grinder.logger.info("Response Status Code: ${response.statusCode}")
            assertThat(response.statusCode, is(200))
        }
    }

    @Test
    public void testStatus() {
        HTTPResponse response = request.GET("http://juchumjuchum.site/api/auth/status")
        if (response.statusCode == 301 || response.statusCode == 302) {
            grinder.logger.warn("Warning. The response may not be correct. The response code was {}.", response.statusCode)
        } else {
            grinder.logger.info("Response Status Code: ${response.statusCode}")
            assertThat(response.statusCode, is(200))
        }
    }
}
