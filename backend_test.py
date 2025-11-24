import requests
import sys
import json
from datetime import datetime

class SAEAPITester:
    def __init__(self, base_url="https://web-redirect.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"{status} - {name}: {details}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if headers:
            test_headers.update(headers)
        
        if self.token and 'Authorization' not in test_headers:
            test_headers['Authorization'] = f'Bearer {self.token}'

        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        print(f"   Method: {method}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            
            try:
                response_data = response.json()
            except:
                response_data = response.text

            details = f"Status: {response.status_code} (expected {expected_status})"
            if not success:
                details += f", Response: {response_data}"

            self.log_test(name, success, details)
            return success, response_data

        except requests.exceptions.RequestException as e:
            self.log_test(name, False, f"Request failed: {str(e)}")
            return False, {}
        except Exception as e:
            self.log_test(name, False, f"Unexpected error: {str(e)}")
            return False, {}

    def test_api_root(self):
        """Test API root endpoint"""
        return self.run_test(
            "API Root",
            "GET",
            "",
            200
        )

    def test_register_user(self, username, email, password):
        """Test user registration"""
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data={
                "username": username,
                "email": email,
                "password": password
            }
        )
        return success, response

    def test_register_duplicate_email(self, username, email, password):
        """Test registration with duplicate email"""
        success, response = self.run_test(
            "Duplicate Email Registration",
            "POST",
            "auth/register",
            400,
            data={
                "username": username,
                "email": email,
                "password": password
            }
        )
        return success, response

    def test_login_valid(self, email, password):
        """Test login with valid credentials"""
        success, response = self.run_test(
            "Valid Login",
            "POST",
            "auth/login",
            200,
            data={
                "email": email,
                "password": password
            }
        )
        
        if success and isinstance(response, dict) and 'access_token' in response:
            self.token = response['access_token']
            self.log_test("Token Extraction", True, "JWT token extracted successfully")
            return True, response
        elif success:
            self.log_test("Token Extraction", False, "No access_token in response")
            return False, response
        
        return success, response

    def test_login_invalid(self, email, password):
        """Test login with invalid credentials"""
        success, response = self.run_test(
            "Invalid Login",
            "POST",
            "auth/login",
            401,
            data={
                "email": email,
                "password": password
            }
        )
        return success, response

    def test_verify_token(self):
        """Test token verification"""
        if not self.token:
            self.log_test("Token Verification", False, "No token available")
            return False, {}
            
        success, response = self.run_test(
            "Token Verification",
            "GET",
            "auth/verify",
            200
        )
        return success, response

    def test_verify_invalid_token(self):
        """Test verification with invalid token"""
        # Temporarily use invalid token
        original_token = self.token
        self.token = "invalid_token_12345"
        
        success, response = self.run_test(
            "Invalid Token Verification",
            "GET",
            "auth/verify",
            401
        )
        
        # Restore original token
        self.token = original_token
        return success, response

    def test_get_profile(self):
        """Test get user profile"""
        if not self.token:
            self.log_test("Get Profile", False, "No token available")
            return False, {}
            
        success, response = self.run_test(
            "Get Profile",
            "GET",
            "auth/profile",
            200
        )
        return success, response

    def test_update_profile(self, new_username=None, new_email=None):
        """Test update user profile"""
        if not self.token:
            self.log_test("Update Profile", False, "No token available")
            return False, {}
        
        update_data = {}
        if new_username:
            update_data["username"] = new_username
        if new_email:
            update_data["email"] = new_email
            
        success, response = self.run_test(
            "Update Profile",
            "PUT",
            "auth/profile",
            200,
            data=update_data
        )
        return success, response

    def test_update_profile_duplicate_username(self, existing_username):
        """Test update profile with duplicate username"""
        if not self.token:
            self.log_test("Update Profile Duplicate Username", False, "No token available")
            return False, {}
            
        success, response = self.run_test(
            "Update Profile Duplicate Username",
            "PUT",
            "auth/profile",
            400,
            data={"username": existing_username}
        )
        return success, response

    def test_update_password(self, current_password, new_password):
        """Test update password"""
        if not self.token:
            self.log_test("Update Password", False, "No token available")
            return False, {}
            
        success, response = self.run_test(
            "Update Password",
            "PUT",
            "auth/password",
            200,
            data={
                "current_password": current_password,
                "new_password": new_password
            }
        )
        return success, response

    def test_update_password_wrong_current(self, wrong_password, new_password):
        """Test update password with wrong current password"""
        if not self.token:
            self.log_test("Update Password Wrong Current", False, "No token available")
            return False, {}
            
        success, response = self.run_test(
            "Update Password Wrong Current",
            "PUT",
            "auth/password",
            400,
            data={
                "current_password": wrong_password,
                "new_password": new_password
            }
        )
        return success, response

    def test_update_avatar(self, avatar_data):
        """Test update avatar"""
        if not self.token:
            self.log_test("Update Avatar", False, "No token available")
            return False, {}
            
        success, response = self.run_test(
            "Update Avatar",
            "PUT",
            "auth/avatar",
            200,
            data={"avatar": avatar_data}
        )
        return success, response

    def print_summary(self):
        """Print test summary"""
        print(f"\n" + "="*60)
        print(f"📊 TEST SUMMARY")
        print(f"="*60)
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%" if self.tests_run > 0 else "0%")
        
        # Show failed tests
        failed_tests = [test for test in self.test_results if not test['success']]
        if failed_tests:
            print(f"\n❌ FAILED TESTS:")
            for test in failed_tests:
                print(f"   - {test['test']}: {test['details']}")
        
        return self.tests_passed == self.tests_run

def main():
    print("🚀 Starting SAE API Testing...")
    print("="*60)
    
    # Initialize tester
    tester = SAEAPITester()
    
    # Test data
    test_timestamp = datetime.now().strftime('%H%M%S')
    test_user = {
        "username": f"profesor_{test_timestamp}",
        "email": f"profesor_{test_timestamp}@test.com",
        "password": "TestPass123!"
    }
    
    # Run tests in sequence
    print("\n🔍 Testing API Root...")
    tester.test_api_root()
    
    print("\n🔍 Testing User Registration...")
    success, register_response = tester.test_register_user(
        test_user["username"], 
        test_user["email"], 
        test_user["password"]
    )
    
    if success:
        print("\n🔍 Testing Duplicate Registration...")
        tester.test_register_duplicate_email(
            f"another_{test_user['username']}", 
            test_user["email"],  # Same email
            test_user["password"]
        )
    
    print("\n🔍 Testing Login...")
    login_success, login_response = tester.test_login_valid(
        test_user["email"], 
        test_user["password"]
    )
    
    print("\n🔍 Testing Invalid Login...")
    tester.test_login_invalid(
        test_user["email"], 
        "wrong_password"
    )
    
    if login_success and tester.token:
        print("\n🔍 Testing Token Verification...")
        tester.test_verify_token()
        
        print("\n🔍 Testing Invalid Token...")
        tester.test_verify_invalid_token()
    
    # Print final summary
    all_passed = tester.print_summary()
    
    # Save results to file
    results_file = "/app/test_reports/backend_api_results.json"
    with open(results_file, 'w') as f:
        json.dump({
            "summary": {
                "total_tests": tester.tests_run,
                "passed_tests": tester.tests_passed,
                "failed_tests": tester.tests_run - tester.tests_passed,
                "success_rate": (tester.tests_passed/tester.tests_run*100) if tester.tests_run > 0 else 0
            },
            "test_results": tester.test_results,
            "timestamp": datetime.now().isoformat()
        }, f, indent=2)
    
    print(f"\n📄 Results saved to: {results_file}")
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())