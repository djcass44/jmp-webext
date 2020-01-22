/*
 *    Copyright 2019 Django Cass
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 *
 */

export default health => {
	const results = [];
	if (health == null) return results;
	// check for springboot non-auth actuator health
	if (health.status != null) {
		results.push({key: "Overall health", value: health.status});
		return results;
	}
	results.push({key: "HTTP status code", value: health.code === 200});
	results.push({key: "Content server", value: health.http === "OK"});
	// database can be null (if not admin)
	if (health.database != null)
		results.push({key: "Database", value: health.database});
	// identity can be null
	if (health.identityProvider != null)
		results.push({key: "Identity Provider", value: health.identityProvider});
	// imageApi is optional
	if (health.imageApi != null)
		results.push({key: "Image Api", value: health.imageApi});
	return results;
};
