/* globals define, HighDash */
/*
 * Copyright 2013 Amadeus s.a.s.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define(["ext/numbers", "math/sum", "module", "highdash"], function (num, sum, module, HighDash) {
	window.DoTheMath = function (values) {
		var initial = module.config().baseValue;
		HighDash.forEach(arguments, function (value) {
			// value is a string
			initial = sum(initial, num[value]);
		});
		return initial;
	};
});
